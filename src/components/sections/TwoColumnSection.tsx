import { CheckCircle } from "lucide-react";

interface TwoColumnProps {
  title: string;
  description: string;
  bullets: string[];
  image: string;
  imageAlt: string;
  flip?: boolean;
}

const TwoColumnSection = ({ title, description, bullets, image, imageAlt, flip }: TwoColumnProps) => {
  return (
    <section className="py-16">
      <div className="container mx-auto grid lg:grid-cols-2 gap-10 items-center">
        <div className={flip ? 'order-2 lg:order-1' : ''}>
          <h2 className="font-inter text-3xl font-bold mb-3">{title}</h2>
          <p className="text-muted-foreground mb-5 max-w-prose">{description}</p>
          <ul className="space-y-2">
            {bullets.map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm text-foreground"><CheckCircle className="h-4 w-4 text-brand" /> {b}</li>
            ))}
          </ul>
        </div>
        <div className={flip ? 'order-1 lg:order-2' : ''}>
          <img src={image} alt={imageAlt} loading="lazy" className="w-full h-auto rounded-lg border" />
        </div>
      </div>
    </section>
  );
};

export default TwoColumnSection;
