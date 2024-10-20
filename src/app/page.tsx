"use client"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import messages from "@/data/messages.json";
import Autoplay from "embla-carousel-autoplay"
export default function Home() {
  return (
    <>
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12" >
      <section className="text-center bg-slate-100 px-10 py-8 rounded-2xl " >
        <h1 className=" font-bold text-4xl " >Embark on a journey of discovery</h1>
        <p className="mt-5 text-lg " >Uncover hidden secrets with every click in Mystery Messages—where each message is a puzzle waiting to be solved.</p>
      </section>

      <section className="mt-5" >
      <Carousel 
      plugins={[Autoplay({delay:2000})]}
      className="w-full max-w-xl h-fit border-none mt-10 ">
      <CarouselContent>
        {
          messages.map((message, idx) => {
            return  <CarouselItem key={idx}>
            <div className="p-1">
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6 h-fit ">
                  <div className="text-2xl font-semibold">{message.title}</div>
                  <div className="mt-4" >{message.description}</div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
          })
        }
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
      </section>
    </main>
    </>
  );
}
