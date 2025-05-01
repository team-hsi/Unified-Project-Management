import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/feature/shared/ui/form";
import { Input } from "@/feature/shared/ui/input";
import { Textarea } from "@/feature/shared/ui/textarea";
import { Button } from "@/feature/shared/ui/button";
import { Loader } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  description: z.string().optional(),
});

interface FormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isPending: boolean;
  defaultValues?: Partial<z.infer<typeof formSchema>>;
  label?: string;
}

export const NameDescriptionForm = ({
  onSubmit,
  isPending,
  defaultValues,
  label,
}: FormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      name: " Create New",
      description: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="px-2">Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder={defaultValues?.name || "Enter name..."}
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="px-2">Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter description..."
                    className="h-9 min-h-[36px] resize-y"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <Button type="submit" className="flex-1" disabled={isPending}>
            {isPending ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              label || "Continue"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
