import { PUBSUB_TOPIC } from "@/shared/src/config";
import {
  createProduct,
  getProducts,
  updateConversation,
} from "@/shared/src/lib/methods";
import { pubSub } from "@/shared/src/lib/pubsub";
import { ConversationStatus } from "@/shared/src/lib/schema";
import { config } from "@/utils/config";
import { Request, Response } from "express";
import puppeteer, { Browser } from "puppeteer";
import { CardType } from "../../types";

async function handleCookiesPopup(page: any) {
  const cookiesButton = await page.$("#sp-cc-accept");
  if (cookiesButton) {
    await cookiesButton.click();
  }
}

export async function scrapeProducts(req: Request, res: Response) {
  try {
    const data = JSON.parse(
      Buffer.from(req.body.message.data, "base64").toString(),
    );
    const response = await runScrape(data);
    if (!response) throw new Error("Scraping failed");
    if (response.status !== 200) {
      throw new Error("Scraping failed");
    }
    return res.status(200).json({ message: "Scraping completed successfully" });
  } catch (err) {
    if (err instanceof Error)
      return res
        .status(500)
        .json({ error: "An error occurred", message: err.message });
  }
}

/**
 * Scrapes product data from a given input
 */
export async function runScrape(data: {
  company: string;
  category: string;
  conversationId: string;
}) {
  let browser: Browser | null = null;
  const { company, category, conversationId } = data;
  if (!conversationId)
    return { status: 400, message: "Conversation ID is required" };

  if (!company || !category) {
    return {
      status: 400,
      message: "Company and category are required",
    };
  }
  const query = `${company}+${category}`;

  // const isProcessing = await retrieveCachedData(mutexKey);
  // if (isProcessing) {
  //   return {
  //     status: 400,
  //     message: "Scraping is already in progress",
  //   };
  // }
  const items = await getProducts({
    company,
    category,
  });

  if (items.length > 0) {
    await updateConversation({
      id: conversationId,
      status: ConversationStatus.EMBEDDING,
    });
    // send pub sub even to emebedding service
    await pubSub.publish(PUBSUB_TOPIC.EMBEDDING, {
      query,
      id: conversationId,
    });
    return {
      data: { products: items, conversationId },
      status: 200,
    };
  } else {
    try {
      // if no products found, update the conversation status to scraping
      await updateConversation({
        id: conversationId,
        status: ConversationStatus.SCRAPING,
      });
      if (config.NODE_ENV === "development") {
        browser = await puppeteer.launch({
          executablePath:
            process.env.CHROME_BIN ||
            "/Users/rahul/.cache/puppeteer/chrome/mac_arm-148.0.7778.97/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
          headless: false,
          defaultViewport: null,
        });
      } else {
        browser = await puppeteer.launch({
          executablePath: process.env.CHROME_BIN || "/usr/bin/chromium-browser",
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
      }
      const page = await browser.newPage();
      // await page.setRequestInterception(true);
      // page.on("request", (req) => {
      //   const resourceType = req.resourceType();

      //   if (
      //     resourceType === "image" ||
      //     resourceType === "font" ||
      //     resourceType === "stylesheet" ||
      //     resourceType === "media"
      //   ) {
      //     req.abort();
      //   } else {
      //     req.continue();
      //   }
      // });
      page.setDefaultNavigationTimeout(60000);
      page.setDefaultTimeout(60000);

      const searchPhrase = company + " " + category;
      const scrapeToPage = 1;

      const homeUrl = `https://www.amazon.in/s?k=${encodeURIComponent(searchPhrase)}`;
      await page.goto(homeUrl, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });

      await handleCookiesPopup(page);
      await page.waitForSelector("#twotabsearchtextbox");
      await page.type("#twotabsearchtextbox", searchPhrase);
      await page.click("#nav-search-submit-button");

      await page.waitForSelector(".s-widget-container");

      const url = page.url();

      const cardData: CardType[] = [];
      const scrapePage = async (
        url: string,
        currentPage = 1,
        scrapeToPage = 1,
      ) => {
        if (!url || (scrapeToPage !== null && currentPage > scrapeToPage)) {
          return;
        }
        await page.goto(url, {
          waitUntil: "domcontentloaded",
          timeout: 60000,
        }); // console.log("Navigated to: ", url);
        await handleCookiesPopup(page);

        await page.waitForSelector(".s-widget-container");
        let pageCardData: CardType[] = await page.evaluate((query: string) => {
          const cards = Array.from(
            document.querySelectorAll(".s-widget-container"),
          );

          const cardInfo = cards
            .map((card) => {
              const productName = card.querySelector("h2")?.textContent?.trim();

              const anchorTag = card.querySelector(
                "a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal",
              );
              if (!anchorTag || !anchorTag?.getAttribute) return null;
              const cardURL =
                "https://www.amazon.in" + anchorTag.getAttribute("href") ||
                "N/A";

              const sponsoredTag = card.querySelector(
                ".puis-sponsored-label-text",
              );
              const sponsored = sponsoredTag ? "yes" : "no";

              const badgeElement = card.querySelector(
                "span.a-badge-label-inner",
              );
              const badge = badgeElement ? badgeElement.textContent : "N/A";

              const priceElement = card.querySelector(".a-price .a-offscreen");
              const price = priceElement
                ? (priceElement.textContent?.split("₹")[1] ?? "N/A")
                : "N/A";

              const basePriceElement = card.querySelector(
                "span.a-price.a-text-price > span.a-offscreen",
              );
              const basePrice = basePriceElement
                ? basePriceElement.textContent
                : "N/A";

              const ratingElement = card.querySelector(
                ".a-row > span:nth-child(1)[aria-label]",
              );
              const decimalRegex = /^\d+([,.]\d+)?$/;
              const ariaLabel =
                ratingElement?.getAttribute("aria-label") || "N/A";
              const firstThreeCharacters = ariaLabel.substring(0, 3);
              const rating = decimalRegex.test(firstThreeCharacters)
                ? firstThreeCharacters.replace(",", ".")
                : "N/A";

              const ratingsNumberElement = card.querySelector(
                ".a-row > span:nth-child(2)[aria-label]",
              );
              const numberRegex = /^-?\d+(\.\d+)?$/;
              const numberFormated =
                ratingsNumberElement
                  ?.getAttribute("aria-label")
                  ?.replace(/[\s.,]+/g, "") || "N/A";
              const ratingsNumber = numberRegex.test(numberFormated)
                ? numberFormated
                : "N/A";

              const boughtPastMonthElement = card.querySelector(
                ".a-row.a-size-base > .a-size-base.a-color-secondary",
              );
              const textContent = boughtPastMonthElement
                ? (boughtPastMonthElement.textContent ?? "N/A")
                : "N/A";
              const plusSignRegex = /\b.*?\+/;
              const plusSignText = textContent.match(plusSignRegex);
              if (!plusSignText) return null;
              const boughtPastMonth = plusSignRegex.test(plusSignText[0])
                ? plusSignText[0]
                : "N/A";
              // const query = "${query}";
              if (productName) {
                return {
                  cardURL,
                  productName,
                  sponsored,
                  badge,
                  price,
                  basePrice,
                  rating,
                  ratingsNumber,
                  boughtPastMonth,
                  query,
                };
              } else {
                return null;
              }
            })
            .filter((card) => card !== null);

          return cardInfo;
        }, query);

        pageCardData = pageCardData.filter(
          (card: CardType) =>
            card.productName &&
            card.productName.toLowerCase().includes(company.toLowerCase()) &&
            card.cardURL !== "N/A",
        );

        for (let card of pageCardData) {
          if (card.productName.toLowerCase().includes(company.toLowerCase())) {
            if (!card.cardURL.includes("amazon.in")) continue;
            const productPage = browser && (await browser.newPage());
            if (!productPage) throw new Error("Product page is not available");
            try {
              await productPage.goto(card.cardURL, {
                waitUntil: "domcontentloaded",
                timeout: 30000,
              });

              await productPage.waitForSelector("#acrCustomerReviewText", {
                timeout: 5000,
              });
              // scrape here using productPage
              await productPage.waitForSelector(
                "span.a-size-base.a-color-base",
              );
              await productPage.waitForSelector(
                '[data-hook="review-collapsed"]',
              );
              await productPage.waitForSelector("#productTitle");
              const productTitle = await productPage.$eval(
                "#productTitle",
                (element) => element.textContent,
              );
              card.productName = productTitle;
              // extract ratings count
              const ratingsCountText = await productPage.$eval(
                "#acrCustomerReviewText",
                (element) => element.textContent,
              );
              card.ratingsCount = parseInt(
                ratingsCountText.split(" ")[0].replace(",", ""),
                10,
              );

              // extract rating
              const ratingText = await productPage.$eval(
                "span.a-size-base.a-color-base",
                (element) => element.textContent,
              );
              card.rating = ratingText;

              // Extract reviews
              const reviewElements = await productPage.$$(
                'div[data-hook="review-collapsed"] > span',
              );
              // // console.log("reviews: ", reviewElements);
              const extractedReviews = [];
              for (const element of reviewElements) {
                const reviewText = await productPage.evaluate(
                  (el) => el.textContent.trim(),
                  element,
                );
                extractedReviews.push(reviewText);
              }
              card.reviews = extractedReviews;
            } catch (err) {
              console.error("error scraping product page", err, card.cardURL);
            } finally {
              await productPage.close();
            }
          }
        }

        cardData.push(...pageCardData);

        if (scrapeToPage === null || currentPage < scrapeToPage) {
          const nextPageButton = await page.$(".s-pagination-next");
          if (nextPageButton) {
            const isDisabled = await page.evaluate(
              (btn) => btn.hasAttribute("aria-disabled"),
              nextPageButton,
            );
            if (!isDisabled) {
              const nextPageUrl = encodeURI(
                await page.evaluate(
                  (nextBtn) => (nextBtn as HTMLAnchorElement).href,
                  nextPageButton,
                ),
              );
              await scrapePage(nextPageUrl, currentPage + 1, scrapeToPage);
            } else {
            }
          } else if (!scrapeToPage || currentPage < scrapeToPage) {
            console.error("All available pages scraped:", currentPage);
          }
        }
      };
      await scrapePage(url, 1, scrapeToPage);

      for (const product of cardData) {
        try {
          await createProduct({
            name: product.productName,
            url: product?.cardURL,
            price: parseFloat(product?.price),
            query,
            ratings: parseFloat(product?.rating),
            noOfRatings: parseFloat(product?.ratingsNumber),
            company,
            category,
            reviews: product.reviews,
          });
        } catch (error) {
          console.error(error);
          return { error, status: 500 };
        }
      }
      if (cardData.length === 0) {
        return {
          message: "No products found.",
          status: 404,
        };
      }
      await pubSub.publish(PUBSUB_TOPIC.EMBEDDING, {
        query,
        id: conversationId,
      });
      await updateConversation({
        id: conversationId,
        status: ConversationStatus.EMBEDDING,
      });
      return {
        data: { products: cardData, conversationId },
      };
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        return {
          error: { message: error.message || "An error occurred." },
        };
      }
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}
