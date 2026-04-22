import { useApi } from "@/api/ApiContext";
import { ChatInputValidation } from "@/utils/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { MenuSquare, Search, Stamp } from "lucide-react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { FieldError } from "../ui/field";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import Layout from "./Layout";
const Body = () => {
  const { schedulerApi } = useApi();
  const form = useForm<FieldValues>({
    resolver: zodResolver(ChatInputValidation),
  });

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
    // console.log("Submitting task", data);

    try {
      const task = await schedulerApi?.addTask(data.company, data.category);
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
    <Layout className="flex flex-col gap-5 h-screen">
      <Card className="flex flex-col w-2/3 justify-center items-center p-12 gap-3 h-2/3">
        <div className="flex flex-col gap-2 p-2">
          <h1 className="text-2xl flex items-center gap-2">
            <Search />
            <span>Search for a product</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Select a company and a category to get started. We'll analyze the
            sentiment of the reviews for that product.
          </p>
          <Separator />
        </div>
        <Form {...form}>
          <form
            className="w-full lg:w-2/3 flex flex-col gap-5"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="company"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>
                    <p className="flex gap-2 items-center">
                      Brand <Stamp className="w-4 h-4" />
                      <span className="text-xs text-red-500">*</span>
                    </p>
                  </FormLabel>
                  <Input
                    onChange={field.onChange}
                    defaultValue={field.value}
                    placeholder="Enter Brand Name"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <p className="flex gap-2 items-center">
                      Category
                      <MenuSquare className="w-4 h-4" />
                      <span className="text-xs text-red-500">*</span>
                    </p>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            <p className="text-muted-foreground">
                              Select a category of products to search
                            </p>
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category}
                          value={category.toLowerCase()}
                        >
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
      </Card>
    </Layout>
  );
};

export default Body;
