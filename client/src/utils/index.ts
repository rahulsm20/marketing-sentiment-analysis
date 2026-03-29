export const updateHistory = (company: string, category: string) => {
  if (localStorage.getItem("user")) {
    const user = JSON.parse(localStorage.getItem("user") as string);
    if (!user.history) {
      user.history = [];
    } else {
      user.history = user.history.push({ company, category });
    }
    localStorage.setItem("user", JSON.stringify(user));
  }
};

export const getLoadingTitle = (stage?: string) => {
  switch (stage) {
    case "scraping":
      return "Scraping Products";
    case "generation":
      return "Generating Strategies";
    case "embedding":
      return "Embedding Products into Vectors";
    default:
      return "Loading";
  }
};
