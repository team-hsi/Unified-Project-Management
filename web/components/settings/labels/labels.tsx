"use client";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { motion, AnimatePresence } from "framer-motion";
import { useLabels } from "@/hooks/use-labels";
import { LabelsLoading } from "./labels-loading";
import { EmptyLabelState } from "./empty-labels";
export const LabelsView = () => {
  const { labels } = useLabels(); // Assuming you have a custom hook to fetch labels
  return (
    <div className="p-6">
      <DialogHeader>
        <DialogTitle className="text-xl">Labels</DialogTitle>
        <DialogDescription>Manage labels for your projects.</DialogDescription>
      </DialogHeader>

      <div className="mt-6">
        {labels.isLoading ? (
          <LabelsLoading />
        ) : (
          <>
            <div className="mb-4 rounded-md bg-background p-4">
              <div className="text-sm font-medium">
                {labels.data.length} labels
              </div>
            </div>

            {labels.data.length === 0 ? (
              <EmptyLabelState />
            ) : (
              <div className="space-y-0 rounded-md border">
                <AnimatePresence>
                  <motion.div
                    className="border-b last:border-b-0"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <span className="inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-medium">
                          bug name
                        </span>
                        <span className="text-muted-foreground">
                          description 2
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-8">
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                    <AnimatePresence>
                      <motion.div
                        className="border-t p-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      ></motion.div>
                    </AnimatePresence>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
            <AnimatePresence>
              <motion.div
                className="mt-4 rounded-md border p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
              ></motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
};
