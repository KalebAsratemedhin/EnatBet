import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-12">
      <section className="space-y-6">
        <h1 className="text-4xl font-bold text-center">About Enat Bet</h1>
        <p className="text-lg text-center text-muted-foreground max-w-2xl mx-auto">
          Enat Bet is your all-in-one food ordering platform that empowers restaurant owners to manage their businesses and helps users explore, discover, and enjoy meals from nearby restaurants.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>For Restaurant Owners</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-2">
            <p>
              Manage your restaurant with ease—upload menus, track orders, and engage with your customers.
            </p>
            <p>
              Our intuitive dashboard lets you focus on what matters: serving great food and growing your business.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>For Users</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-2">
            <p>
              Find your favorite dishes from top-rated local restaurants or explore new tastes from emerging kitchens.
            </p>
            <p>
              Place orders, rate your meals, and get timely deliveries—all in one place.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-center">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
          <AccordionItem value="faq-1">
            <AccordionTrigger>Is Enat Bet free to use?</AccordionTrigger>
            <AccordionContent>
              Yes, Enat Bet is completely free for users. Restaurant owners may have access to premium features via subscription.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-2">
            <AccordionTrigger>How do I register my restaurant?</AccordionTrigger>
            <AccordionContent>
              Simply sign up as a restaurant owner and follow the guided onboarding steps to set up your restaurant profile, add your menu, and start receiving orders.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-3">
            <AccordionTrigger>Can I track my food orders?</AccordionTrigger>
            <AccordionContent>
              Absolutely! Users can view the status of their orders in real-time, from confirmation to delivery.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-4">
            <AccordionTrigger>What if I have an issue with an order?</AccordionTrigger>
            <AccordionContent>
              You can reach out through our support section in the app. We’re here to help with any concerns or issues you may face.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
};

export default AboutPage;
