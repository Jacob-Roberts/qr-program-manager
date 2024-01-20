import { Button } from "#/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import QRCode from "react-qr-code";

import { Icon } from "./Icon";

type QRProgram = {
  id: string;
  name: string;
  slug: string;
  uploadedFileName: string;
  createdAt: string;
};

type EditQRCodeProps = {
  cards: QRProgram[];
};

export function EditQRCode({ cards }: EditQRCodeProps) {
  return (
    <main className="flex-1 p-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {cards.map(card => (
          <Card key={card.id} className="mx-auto max-w-2xl">
            <CardHeader>
              <div className="flex flex-row items-center">
                <CardTitle>{card.name}</CardTitle>
                <Button
                  variant="outline"
                  size="icon"
                  className="ml-auto hover:text-gray-900 active:text-gray-800"
                >
                  <Icon name="square-pen" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="ml-2 text-red-500 hover:text-red-600 active:text-red-700"
                >
                  <Icon name="trash-2" />
                </Button>
              </div>
              <CardDescription>Created {card.createdAt}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="pdf">
                  {card.uploadedFileName} (Click to Edit)
                </Label>
                <Input accept=".pdf" id="pdf" type="file" />
              </div>
              <div className="flex items-center justify-center rounded-lg bg-white p-4">
                <QRCode value="hey" />
              </div>
              <Button className="self-start">Print QR Code</Button>
            </CardContent>
          </Card>
        ))}
        <Card className="group mx-auto flex max-w-2xl items-center justify-center border-2 border-dashed border-gray-300 hover:cursor-pointer hover:border-blue-400 dark:border-gray-600">
          <CardHeader>
            <CardTitle>Add more</CardTitle>
            <CardDescription>Add more cards to your dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <div className="text-6xl text-gray-300 group-hover:text-blue-400 dark:text-gray-600">
              +
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
