import PageMeta from "../components/common/PageMeta";
import Container from "../components/common/Container";
import Button from "../components/common/Button";

function NotFound() {
  return (
    <main className="wd-section-black flex min-h-screen items-center py-32">
      <PageMeta
        title="Page Not Found"
        description="The page you are looking for does not exist on Web District."
      />

      <Container>
        <div className="wd-card-on-black mx-auto max-w-2xl rounded-[2rem] p-8 text-center md:p-12">
          <p className="text-sm font-bold uppercase tracking-[0.34em] text-[#C4A77D]">
            404
          </p>

          <h1 className="font-display mt-5 text-5xl font-extrabold leading-[1] tracking-[-0.07em] text-[#F8F7F4] md:text-7xl">
            This page went off-grid.
          </h1>

          <p className="mx-auto mt-6 max-w-xl leading-8 text-[#D9D4CC]">
            The page you are looking for does not exist, was moved, or the link
            is incorrect.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <Button to="/">Back home</Button>
            <Button to="/start" variant="secondary">
              Start Your Project
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
}

export default NotFound;
