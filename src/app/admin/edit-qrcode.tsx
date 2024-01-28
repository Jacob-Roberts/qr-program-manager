import { AddNewProgram } from "./add-new-program";
import { ExistingProgramCard } from "./existing-program";

type QRProgram = {
  id: number;
  slug: string;
  uploadedFileName: string;
  createdAt: string;
  updatedAt: string;
};

type EditQRCodeProps = {
  cards: QRProgram[];
};

export function EditQRCode({ cards }: EditQRCodeProps) {
  return (
    <main className="flex-1 p-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {cards.map(card => (
          <ExistingProgramCard key={card.id} card={card} />
        ))}
        <AddNewProgram />
      </div>
    </main>
  );
}
