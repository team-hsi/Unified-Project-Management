"use client";
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarRange,
  ChevronsUp,
  Loader,
  Loader2,
  Newspaper,
  Plus,
  TagIcon,
  Users,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import InlineEdit from "@/components/ui/inline-edit";
import { useItemAction } from "@/hooks/use-item";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format, addDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import type { ItemFormValues } from "./types";
import { itemFormSchema } from "@/components/form/schema";
import MultipleSelector from "../ui/multiselect";
import { useLabels } from "@/hooks/use-labels";
import { Item } from "@/@types/item";
import { Label } from "@/@types/label";

const MetadataField = ({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-center gap-2 flex-auto">
    <div className="flex items-center gap-2">
      <Icon size={15} className="text-muted-foreground" />
      <p className="w-24 text-sm text-muted-foreground">{label}</p>
    </div>
    {children}
  </div>
);

export const ItemDetails = ({
  item,
  setUnsavedForm,
  unsavedForm,
}: {
  item: Item;
  setUnsavedForm: (value: boolean) => void;
  unsavedForm: boolean;
}) => {
  const { updateItemInline } = useItemAction({
    queryKey: [item.bucket.project.id, "items"],
    successAction: () => {
      setUnsavedForm(false);
      form.reset(form.getValues());
    },
  });
  const { labels } = useLabels({ projectId: item.bucket.project.id });

  const labelOptions = React.useMemo(() => {
    return (
      labels.data?.data.map((label: Label) => ({
        value: label.id,
        label: label.name,
        color: label.color,
      })) || []
    );
  }, [labels.data?.data]);

  const initialLabels = React.useMemo(() => {
    return (item.labels || [])
      .map((label) =>
        labelOptions.find((l: { value: string }) => l.value === label.id)
      )
      .filter(Boolean);
  }, [item.labels, labelOptions]);

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      status: (item.status as "incomplete" | "complete") || "incomplete",
      dueDate: item?.dueDate ? new Date(item.dueDate) : undefined,
      priority: item?.priority || "",
      description: item?.description || "",
      labels: initialLabels,
    },
  });

  // Track form dirty state
  React.useEffect(() => {
    setUnsavedForm(form.formState.isDirty);
  }, [form.formState.isDirty, setUnsavedForm]);

  // Handle form submission
  const onSubmit = (data: ItemFormValues) => {
    const labelIds = (data.labels ?? []).map((label) => label.value);
    const payload: ItemFormValues = { ...data };
    if (payload.priority === "") {
      delete payload.priority;
    }

    return updateItemInline.mutateAsync({
      id: item.id,
      ...payload,
      labels: labelIds,
      dueDate: data.dueDate ? data.dueDate.toISOString() : "",
    });
  };

  return (
    <div className="w-4/5 mx-auto">
      <div className="flex flex-col gap-6 lg:px-6">
        {/* Item title with inline editing */}
        <div className="font-bold text-xl md:text-2xl xl:text-3xl mt-4">
          <InlineEdit
            text={item.name}
            textStyle="cursor-pointer"
            inputStyle="rounded-md"
            onSave={(value) =>
              updateItemInline.mutateAsync({
                id: item.id,
                name: value,
              })
            }
          />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <section className="flex flex-col flex-wrap gap-4">
              {/* Status Field */}
              <MetadataField icon={Loader} label="Status">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <div className="flex items-center gap-2 p-0.5 rounded-md">
                          <Checkbox
                            checked={field.value === "complete"}
                            onCheckedChange={(checked) => {
                              field.onChange(
                                checked ? "complete" : "incomplete"
                              );
                            }}
                            className="rounded-full data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 border-foreground cursor-pointer"
                          />
                          <span className="capitalize">{field.value}</span>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </MetadataField>

              {/* Due Date Field */}
              <MetadataField icon={CalendarRange} label="Due Date">
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="sr-only">Due date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={cn(
                                "p-1 font-normal",
                                !field.value && ""
                              )}
                            >
                              {field.value ? (
                                format(field.value, "yyyy-MM-dd")
                              ) : (
                                <span className="pl-5">Set date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          align="start"
                          className="flex w-auto flex-col space-y-2 p-2"
                        >
                          <Select
                            onValueChange={(value) =>
                              field.onChange(
                                addDays(new Date(), Number.parseInt(value))
                              )
                            }
                          >
                            <SelectTrigger className="w-full border">
                              <SelectValue placeholder="Select date" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                              <SelectItem value="0">Today</SelectItem>
                              <SelectItem value="1">Tomorrow</SelectItem>
                              <SelectItem value="3">In 3 days</SelectItem>
                              <SelectItem value="7">In a week</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="rounded-md border">
                            <Calendar
                              mode="single"
                              selected={field.value ?? undefined}
                              onSelect={field.onChange}
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
              </MetadataField>

              {/* Assignee Field */}
              <MetadataField icon={Users} label="Assignee">
                <div className="flex items-center -space-x-2">
                  <Avatar className="h-6 w-6 border-2 border-background">
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt="Calum Tyler"
                    />
                    <AvatarFallback className="text-xs">CT</AvatarFallback>
                  </Avatar>
                  <Avatar className="h-6 w-6 border-2 border-background">
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt="Dawson Tarman"
                    />
                    <AvatarFallback className="text-xs bg-green-100 text-green-800">
                      DT
                    </AvatarFallback>
                  </Avatar>
                  <Avatar className="h-6 w-6 border-2 border-background">
                    <AvatarFallback className="text-xs">
                      <Plus size={10} />
                    </AvatarFallback>
                  </Avatar>
                </div>
              </MetadataField>

              {/* Priority Field */}
              <MetadataField icon={ChevronsUp} label="Priority">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="sr-only">Priority</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value || null)}
                        defaultValue={field.value || undefined}
                      >
                        <FormControl>
                          <SelectTrigger className="border-0 h-auto shadow-none">
                            <SelectValue placeholder="set priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="">
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </MetadataField>
              {/* Labels Field */}
              <MetadataField icon={TagIcon} label="Labels">
                <FormField
                  control={form.control}
                  name="labels"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="sr-only">Labels</FormLabel>
                      <FormControl>
                        <MultipleSelector
                          commandProps={{
                            label: "Add labels",
                          }}
                          // isPending={labels.isPending}
                          loadingIndicator={
                            <div className="flex w-full p-1 items-center justify-center">
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                          }
                          defaultOptions={labelOptions}
                          className=" border-0"
                          placeholder="Add Labels..."
                          hideClearAllButton
                          emptyIndicator={
                            <p className="text-center text-sm">
                              No results found
                            </p>
                          }
                          value={field.value} //fix here too
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </MetadataField>
            </section>

            {/* Description Section */}
            <section>
              <Accordion type="single" collapsible defaultValue="description">
                <AccordionItem value="description">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Newspaper size={15} className="text-muted-foreground" />
                      <p className="w-24 text-sm text-muted-foreground">
                        Description
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Add a description..."
                              className="w-full p-2 border rounded-md text-sm"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            {/* Save Button - only shown when form is dirty */}
            {unsavedForm && (
              <Button type="submit" className="mt-4">
                {updateItemInline.isPending ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};
