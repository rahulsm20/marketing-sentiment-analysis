import { GanttChartIcon, GithubIcon, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const socials = [
    {
      name: "Github",
      icon: <GithubIcon />,
      url: "https://github.com/rahulsm20/marketing-sentiment-analysis",
    },
    {
      name: "Twitter",
      icon: <Twitter />,
      url: "https://twitter.com/boringBroccoli",
    },
  ];

  return (
    <footer className="border-t p-5 gap-3 flex justify-around items-start bottom-0 mt-0">
      <div className="flex flex-col gap-2">
        <p className="text-lg text-start flex gap-2">
          <GanttChartIcon />
          Market Sentience
        </p>
        <span className="text-sm text-zinc-500">
          One-stop shop for all your marketing analysis needs.
        </span>
        <div className="flex flex-col gap-3">
          <ul className="flex gap-2 list-disc ">
            {socials.map(({ name, url, icon }) => (
              <li key={name} className="flex gap-2">
                <Link
                  to={url}
                  key={name}
                  target="_blank"
                  className=" dark:text-zinc-300 hover:underline flex"
                >
                  {icon}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <p className="flex gap-2 text-zinc-500 text-xs">
          © {new Date().getFullYear()} Market Sentience
        </p>
        <span className="text-xs text-zinc-500">
          Please enjoy each feature equally.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
