import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Footer from "@/components/user/Footer";
import Layout from "@/components/user/Layout";
import Navbar from "@/components/user/Navbar";
import { useAuth0 } from "@auth0/auth0-react";
import {
  ArrowRight,
  GanttChart,
  GanttChartSquare,
  GitBranchPlus,
  LineChart,
  MessageCircle,
  Smile,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const { user, loginWithRedirect } = useAuth0();
  const features = [
    {
      title: "Live Product Data",
      description:
        "Get real-time data on product performance and trends consolidated from various sources.",
      icon: <GanttChart />,
    },
    {
      title: "Sentiment Analysis",
      description: "Analyze customer sentiments to improve your strategy.",
      icon: <Smile />,
    },
    {
      title: "Comprehensive Reports",
      description: "Generate detailed reports for better decision-making.",
      icon: <LineChart />,
    },
    {
      title: "Comprehensive chat",
      description:
        "Engage in meaningful conversations with our AI chatbot to get insights and answers.",
      icon: <MessageCircle />,
    },
    {
      title: "Customizable Dashboards",
      description: "Tailor your dashboard to fit your needs.",
      icon: <GanttChartSquare />,
    },
    {
      title: "Open Source",
      description: "Contribute to our open-source project and help us grow.",
      icon: <GitBranchPlus />,
    },
  ];

  const navigate = useNavigate();
  return (
    <div className="hero">
      <Navbar />
      <Layout className="flex px-20 items-center mb-20">
        <div className="flex items-center justify-between flex-col lg:flex-row gap-2 lg:gap-5 xl:w-1/2">
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold mb-4">
              <GanttChart className="inline-block mr-2" />
              Market Sentience
            </h1>
            <p className="text-lg mb-8">
              One-stop shop for all your marketing analysis needs.
            </p>
          </div>
          <Button
            className="flex gap-1"
            onClick={() => (user ? navigate("/home") : loginWithRedirect())}
          >
            <span>Get Started</span>
            <ArrowRight className="h-4 w-4" />
          </Button>{" "}
        </div>
        <div className="flex flex-col gap-10 border p-5">
          <h1 className="text-3xl border-b py-3 font-semibold">Features</h1>
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-2 hover:-translate-y-2 duration-300 ease-in-out hover:shadow-md hover:shadow-red-600 max-w-72"
              >
                <CardHeader>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                  {feature.icon && <div className="mt-4">{feature.icon}</div>}
                </CardContent>
              </Card>
            ))}
          </section>
        </div>
      </Layout>
      <Footer />
    </div>
  );
};

export default Landing;
