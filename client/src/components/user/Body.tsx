import { schedulerApi } from "@/api/auth0";
import { Search } from "lucide-react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Layout from "./Layout";

//-------------------------------------------------------------------------------

const Body = () => {
  const form = useForm<FieldValues>();
  const categories = [
    "Mobiles",
    "Television",
    "Refridgerators",
    "Laptops",
    "Headphones",
  ];

  // const [loading, setLoading] = useState(false);
  // const [showStopwatch, setShowStopwatch] = useState(false);
  // const [strategies, setStrategies] = useState("");
  // const [productData, setProductData] = useState([]);
  // const [sentiments, setSentiments] = useState([]);
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    // setLoading(true);
    // setShowStopwatch(true);
    console.log("Submitting task", data);

    try {
      const task = await schedulerApi.addTask(data.company, data.category);
      if (task && task.conversationId) {
        navigate(`/conversation/${task.conversationId}`);
        // const res = await generateStrategies(data.company, data.category);
        // const { data: result, productData } = res;
        // setStrategies(result?.response?.output?.[0]?.content?.[0]?.text || "");
        // setProductData(productData);
        // setSentiments(result?.sentiments);
      }
    } catch (err) {
      alert("An error occurred. Please try again.");
      console.log(err);
    } finally {
      // setLoading(false);
      // setShowStopwatch(false);
    }
  };

  return (
    <Layout className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl flex items-center gap-2">
          <Search className="inline" />
          <span>Market Sentience</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Search for a product to get the best strategies to sell it.
        </p>
      </div>
      <Form {...form}>
        <form
          className="w-full md:w-1/2 lg:w-1/3 flex flex-col gap-5"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormLabel>Company</FormLabel>
          <Input
            placeholder="Enter Company Name"
            {...form.register("company")}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category of products to search" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      {/* <div className="flex flex-col gap-2 w-full lg:w-2/3 overflow-x-clip">
        {loading && <Loader2 className="animate-spin" />}
        {showStopwatch && <Stopwatch />}
        <div className="flex flex-col flex-wrap gap-5 w-full">
          {productData && sentiments && strategies && !loading && (
            <Analytics sentiments={sentiments} productData={productData} />
          )}
          {strategies && !loading && (
            <Markdown className="flex flex-col gap-5 w-full">
              {strategies}
            </Markdown>
          )}
        </div>
      </div> */}
    </Layout>
  );
};

export default Body;
