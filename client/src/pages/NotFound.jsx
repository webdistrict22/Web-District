import { Link } from "react-router-dom";
import Container from "../components/common/Container";
import Button from "../components/common/Button";

function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center py-20">
      <Container className="text-center">
        <p className="text-sm font-bold uppercase tracking-[0.34em] text-[#C69A4E]">
          404
        </p>
        <h1 className="font-display mt-4 text-5xl font-bold tracking-[-0.06em]">
          Page not found
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-[#94A3B8]">
          This page does not exist or has been moved.
        </p>
        <div className="mt-8">
          <Button to="/">Back home</Button>
        </div>
      </Container>
    </main>
  );
}

export default NotFound;