import { useState } from "react";
import Container from "../../components/common/Container";
import SectionHeader from "../../components/common/SectionHeader";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import StartOptions from "../../components/start/StartOptions";
import WebsiteRequestForm from "../../components/start/WebsiteRequestForm";
import BookCallForm from "../../components/start/BookCallForm";
import useAuth from "../../hooks/useAuth";

function Start() {
  const [activeOption, setActiveOption] = useState("request");
  const { isAuthenticated, user } = useAuth();

  return (
    <main className="bg-[#080808]">
      <section className="wd-section-black pt-32 pb-6 md:pb-8">
        <Container>
        <SectionHeader
          eyebrow="Start"
          title="Start Your Project."
          description="Send the details now, or book a call if you want to shape the direction first."
        />
        </Container>
      </section>

      <section className="wd-section-black pt-6 pb-16 md:pt-8 md:pb-20">
        <Container>
        {isAuthenticated && (
          <Card className="wd-card-on-black mb-8 border-[#C4A77D]/25 p-5">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="font-semibold text-[#F8F7F4]">
                  You're starting as {user?.name}
                </p>
                <p className="mt-1 text-sm text-[#D9D4CC]">
                  Your requests and appointments will appear in your dashboard.
                </p>
              </div>

              <Button to="/account/requests" variant="secondary">
                View my requests
              </Button>
            </div>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-[340px_1fr] lg:items-start">
          <StartOptions
            activeOption={activeOption}
            setActiveOption={setActiveOption}
            cardClassName="wd-card-on-black"
          />

          <div>
            {activeOption === "request" ? (
              <WebsiteRequestForm className="wd-card-on-black" />
            ) : (
              <BookCallForm className="wd-card-on-black" />
            )}
          </div>
        </div>
        </Container>
      </section>
    </main>
  );
}

export default Start;
