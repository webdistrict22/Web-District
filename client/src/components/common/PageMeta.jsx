import { useEffect } from "react";
import { AGENCY } from "../../lib/constants";

function PageMeta({ title, description }) {
  useEffect(() => {
    const finalTitle = title ? `${title} | ${AGENCY.name}` : AGENCY.name;

    document.title = finalTitle;

    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');

      if (!metaDescription) {
        metaDescription = document.createElement("meta");
        metaDescription.setAttribute("name", "description");
        document.head.appendChild(metaDescription);
      }

      metaDescription.setAttribute("content", description);
    }
  }, [title, description]);

  return null;
}

export default PageMeta;