"use client";
import * as React from "react";

import {
  CalendarRange,
  Flag,
  Loader,
  Loader2,
  Newspaper,
  Tag,
} from "lucide-react";
import { Textarea } from "@/feature/shared/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/feature/shared/ui/accordion";
import InlineEdit from "@/feature/shared/ui/inline-edit";
import { useItemMutation } from "@/feature/shared/hooks/use-item-mutation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/feature/shared/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/feature/shared/ui/popover";
import { Button } from "@/feature/shared/ui/button";
import { cn } from "@/lib/utils";
import { format, addDays } from "date-fns";
import { Calendar } from "@/feature/shared/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/feature/shared/ui/select";
import { Checkbox } from "@/feature/shared/ui/checkbox";
import type { ItemFormValues } from "../shared/types";
import { useLabel } from "@/feature/shared/hooks/use-label";
import { Item } from "@/feature/shared/@types/item";
import { Label } from "@/feature/shared/@types/label";
import { itemFormSchema } from "../shared/schema";
import MultipleSelector from "@/feature/shared/ui/multiselect";
import { useMilestone } from "@/feature/shared/hooks/use-milestone";
const MetadataField = ({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-center gap-2 flex-1 min-w-[200px]">
    <div className="flex items-center gap-2">
      <Icon size={15} className="text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{label}</p>
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
  const { update } = useItemMutation();
  const { milestones } = useMilestone({ projectId: item.bucket.project.id });
  const { labels } = useLabel({ projectId: item.bucket.project.id });

  const labelOptions = React.useMemo(() => {
    return (
      labels?.map((label: Label) => ({
        value: label.id,
        label: label.name,
        color: label.color,
      })) || []
    );
  }, [labels]);

  const initialLabels = React.useMemo(() => {
    return (
      item.labels.map((label) => ({
        value: label.id,
        label: label.name,
        color: label.color,
      })) || []
    );
  }, [item.labels]);

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      status: item.status,
      dueDate: item?.dueDate ? new Date(item.dueDate) : undefined,
      startDate: item?.startDate ? new Date(item.startDate) : undefined,
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
  const onSubmit = async (data: ItemFormValues) => {
    const labelIds = (data.labels ?? []).map((label) => label.value);
    const payload: ItemFormValues = { ...data };
    if (payload.priority === "") {
      delete payload.priority;
    }
    await update.mutateAsync({
      id: item.id,
      bucketId: item.bucket.id,
      projectId: item.bucket.project.id,
      ...payload,
      labels: labelIds,
      dueDate: data.dueDate ? data.dueDate.toISOString() : "",
      startDate: data.startDate ? data.startDate.toISOString() : "",
    });
    setUnsavedForm(false);
    form.reset(form.getValues());
  };

  return (
    <div className="overflow-auto">
      <div className="flex flex-col gap-3 p-4">
        {/* Item title with inline editing */}
        <div className="font-bold text-xl">
          <InlineEdit
            text={item.name}
            textStyle="cursor-pointer"
            inputStyle="rounded-md"
            onSave={(value) =>
              update.mutateAsync({
                id: item.id,
                name: value,
                bucketId: item.bucket.id,
                projectId: item.bucket.project.id,
              })
            }
          />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                          <span className="capitalize text-sm">
                            {field.value}
                          </span>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </MetadataField>

              {/* Due Date Field */}
              <MetadataField icon={CalendarRange} label="Start Date">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="sr-only">Start date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={cn(
                                "p-1 font-normal text-sm",
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
                                "p-1 font-normal text-sm",
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

              {/* Milestone Field */}
              <FormField
                name="milestoneId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Milestone</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a milestone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* Assuming 'milestones' is an array of Milestone objects */}
                        {milestones?.map((milestone) => (
                          <SelectItem key={milestone.id} value={milestone.id}>
                            {milestone.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* Priority Field */}
              <MetadataField icon={Flag} label="Priority">
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
                          <SelectTrigger className="border-0 h-auto shadow-none text-sm">
                            <SelectValue placeholder="set priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
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
              <MetadataField icon={Tag} label="Labels">
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
                          loadingIndicator={
                            <div className="flex w-full p-1 items-center justify-center">
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                          }
                          defaultOptions={labelOptions}
                          className="border-0"
                          placeholder="Add Labels..."
                          hideClearAllButton
                          emptyIndicator={
                            <p className="text-center text-sm">
                              No results found
                            </p>
                          }
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </MetadataField>
            </section>

            {/* Description Section */}
            <section className="mt-3">
              <Accordion type="single" collapsible defaultValue="description">
                <AccordionItem value="description">
                  <AccordionTrigger className="py-2">
                    <div className="flex items-center gap-2">
                      <Newspaper size={15} className="text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
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
              <Button type="submit" className="mt-3" size="sm">
                {update.isPending ? "Updating..." : "Update"}
              </Button>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};
