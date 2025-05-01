import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/feature/shared/ui/card";
export const EmptyChat = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <Card className="w-fit h-fit p-2 border border-chat-border rounded-lg shadow-md max-w-sm">
        <CardHeader>
          <CardTitle>No messages here yet...</CardTitle>
          <CardDescription>
            Send a message or tap the greeting below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xl animate-bounce">👋</p>
        </CardContent>
      </Card>
    </div>
  );
};
