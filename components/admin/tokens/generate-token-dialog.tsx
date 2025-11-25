"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusIcon, Copy, Check } from "lucide-react";
import { useGenerateToken } from "@/hooks/use-registration-tokens";
import { useState } from "react";

const schema = z.object({
  role: z.enum(["teacher", "head teacher"]),
  expiresInDays: z.coerce
    .number()
    .min(1, "Must be at least 1 day")
    .max(365, "Cannot exceed 365 days")
    .default(30),
});

type FormValues = z.infer<typeof schema>;

export function GenerateTokenDialog() {
  const [open, setOpen] = React.useState(false);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { mutateAsync, isPending } = useGenerateToken();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: "teacher",
      expiresInDays: 30,
    },
  });

  const closeDialog = () => {
    setOpen(false);
    reset();
    setGeneratedToken(null);
    setCopied(false);
  };

  const onSubmit = async (values: any) => {
    try {
      const result = await mutateAsync(values);
      setGeneratedToken(result.token);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const copyToClipboard = async () => {
    if (generatedToken) {
      await navigator.clipboard.writeText(generatedToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) {
          closeDialog();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="default">
          <PlusIcon className="size-4 mr-2" />
          Generate Token
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Generate Registration Token</DialogTitle>
          <DialogDescription>
            Generate a registration token for teachers or head teachers to join your school.
          </DialogDescription>
        </DialogHeader>
        {!generatedToken ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  defaultValue="teacher"
                  onValueChange={(value) => {
                    register("role").onChange({
                      target: { value, name: "role" },
                    });
                  }}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="head teacher">Head Teacher</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-sm text-destructive">
                    {typeof errors.role === 'object' && 'message' in errors.role 
                      ? String(errors.role.message) 
                      : String(errors.role)}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="expiresInDays">
                  Expiration (days) - Default: 30
                </Label>
                <Input
                  id="expiresInDays"
                  type="number"
                  min="1"
                  max="365"
                  placeholder="30"
                  {...register("expiresInDays")}
                />
                {errors.expiresInDays && (
                  <p className="text-sm text-destructive">
                    {typeof errors.expiresInDays === 'object' && 'message' in errors.expiresInDays 
                      ? String(errors.expiresInDays.message) 
                      : String(errors.expiresInDays)}
                  </p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Generating..." : "Generate Token"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4 py-2">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                Token Generated Successfully!
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-background border rounded text-sm break-all">
                  {generatedToken}
                </code>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-green-700 dark:text-green-300 mt-2">
                Share this token with the user. They can use it to register at{" "}
                <span className="font-mono">/register</span>
              </p>
            </div>
            <DialogFooter>
              <Button type="button" onClick={closeDialog}>
                Close
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

