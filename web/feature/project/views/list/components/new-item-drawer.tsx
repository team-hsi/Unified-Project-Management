"use client";
import React, { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/feature/shared/ui/drawer";
import { Button } from "@/feature/shared/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/feature/shared/ui/form";
import { Input } from "@/feature/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/feature/shared/ui/select";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getProjectBuckets } from "@/actions/api/bucket/queries";
import { Bucket } from "@/feature/shared/@types/bucket";
import { useItem } from "@/feature/shared/hooks/use-item";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  bucketId: z.string().nonempty({ message: "Please select a bucket." }),
});

type FormValues = z.infer<typeof formSchema>;

interface AddItemDrawerProps {
  children: React.ReactNode;
}

export function AddItemDrawer({ children }: AddItemDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams() as { projectId: string };
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      bucketId: "",
    },
  });
  const { data } = useSuspenseQuery({
    queryKey: [params.projectId, "buckets"],
    queryFn: () => getProjectBuckets({ id: params.projectId }),
  });
  const { create } = useItem();
  const handleSubmit = async (values: FormValues) => {
    await create.mutateAsync({ ...values, projectId: params.projectId });
    setIsOpen(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <div onClick={() => setIsOpen(true)}>{children}</div>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Add New Item</DrawerTitle>
            <DrawerDescription>
              Create a new item with minimal information.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter item name"
                          {...field}
                          autoFocus
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bucketId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bucket</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select bucket" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {data.map((bucket: Bucket) => (
                            <SelectItem key={bucket.id} value={bucket.id}>
                              <div className="flex items-center">
                                {bucket.color && (
                                  <div
                                    className="w-3 h-3 rounded-full mr-2"
                                    style={{ backgroundColor: bucket.color }}
                                  />
                                )}
                                {bucket.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
          <DrawerFooter>
            <Button onClick={form.handleSubmit(handleSubmit)}>Add Item</Button>
            <DrawerClose asChild>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
