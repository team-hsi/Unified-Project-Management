import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Define the validation schema using Zod
const spaceFormSchema = z.object({
  name: z.string().min(2, {
    message: "Space name must be at least 2 characters.",
  }),
  description: z.string().optional(), // Description is optional
});

// Infer the type from the schema
type SpaceFormValues = z.infer<typeof spaceFormSchema>;

interface AddSpaceDialogProps {
  children: React.ReactNode; // Accept children for the trigger
}

export function AddSpaceDialog({ children }: AddSpaceDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Initialize react-hook-form
  const form = useForm<SpaceFormValues>({
    resolver: zodResolver(spaceFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Handle form submission
  async function onSubmit(values: SpaceFormValues) {
    // Replace with your actual logic to create the space
    console.log("Creating space:", values);
    // Example: await createSpaceApiCall(values);
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    form.reset(); // Reset form fields
    setIsOpen(false); // Close the dialog
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      {/* Add custom class for positioning: top-[40%] translate-y-[-40%] */}
      <DialogContent className="sm:max-w-[425px] top-[40%] translate-y-[-40%]">
        <DialogHeader>
          <DialogTitle>Create New Space</DialogTitle>
          <DialogDescription>
            Fill in the details for your new space below. Click save when done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Marketing Team" {...field} />
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
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the purpose or goals of this space"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save Space"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
