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
    <main className="pb-20 pt-32">
      <Container>
        <SectionHeader
          eyebrow="Start"
          title="Start your website with Web District."
          description="Choose the path that fits you best: submit a website request with your project details, or book a call to discuss the right direction first."
          className="mb-10"
        />

        {isAuthenticated && (
          <Card className="mb-8 border-[#C69A4E]/25 p-5">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="font-semibold text-white">
                  You’re starting as {user?.name}
                </p>
                <p className="mt-1 text-sm text-[#94A3B8]">
                  Requests and appointments submitted while logged in will appear in your client dashboard.
                </p>
              </div>

              <Button to="/account/requests" variant="secondary">
                View my requests
              </Button>
            </div>
          </Card>
        )}

        <StartOptions
          activeOption={activeOption}
          setActiveOption={setActiveOption}
        />

        <div className="mt-10">
          {activeOption === "request" ? <WebsiteRequestForm /> : <BookCallForm />}
        </div>
      </Container>
    </main>
  );
}

export default Start;