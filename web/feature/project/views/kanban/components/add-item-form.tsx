"use client";
import { Button } from "@/feature/shared/ui/button";
import { Input } from "@/feature/shared/ui/input";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/feature/shared/ui/form";

const formSchema = z.object({
  content: z.string().min(3, "title min length 3"),
});

type FormData = z.infer<typeof formSchema>;

interface AddCardFormProps {
  onSubmit: (content: string) => void;
  onCancel: () => void;
}

const AddCardForm = ({ onSubmit, onCancel }: AddCardFormProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleSubmit = (data: FormData) => {
    form.reset();
    onSubmit(data.content);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter a title for this card"
                  className="w-full bg-white"
                  autoFocus
                />
              </FormControl>
              <FormMessage className="text-xs text-red-700" />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button
            type="submit"
            size="sm"
            disabled={form.formState.isSubmitting}
          >
            Add Card
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
            <X size={16} />
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddCardForm;
