"use client";
import { Button } from "@/feature/shared/ui/button";
import { Input } from "@/feature/shared/ui/input";
import { Badge } from "@/feature/shared/ui/badge";
import { generateRandomColor } from "@/lib/utils";
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
import { ColorInput } from "@/feature/shared/ui/color-input";
import { LabelPayload } from "@/feature/shared/@types/label";

const formSchema = z.object({
  name: z.string().min(3, "Label name is required"),
  color: z.string().min(3, "Color is required"),
});

type FormValues = z.infer<typeof formSchema>;
type LabelProps = Pick<LabelPayload, "name" | "color">;
interface LabelFormProps {
  initialData: LabelProps;
  onSave: (data: LabelProps) => void;
  onCancel: () => void;
}

export function LabelForm({ initialData, onCancel, onSave }: LabelFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData.name || "",
      color: initialData.color || generateRandomColor(),
    },
  });
  const watchedValues = form.watch();
  const onSubmit = (values: FormValues) => {
    onSave(values);
  };

  return (
    <div className="rounded-md bg-muted/30 p-6">
      {/* Label Preview */}
      <div className="font-medium flex gap-6 mb-6">
        <span>Preview</span>
        <Badge
          className="inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-medium text-white"
          style={{ backgroundColor: watchedValues.color }}
        >
          {watchedValues.name || "Label"}
        </Badge>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">
                  Label name
                </FormLabel>
                <FormControl>
                  <Input placeholder="Label name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium sr-only">
                  Color
                </FormLabel>
                <FormControl>
                  <ColorInput
                    defaultValue={field.value}
                    onChange={(color) => form.setValue("color", color)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-start gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              {initialData.name ? "Update label" : "Create label"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
