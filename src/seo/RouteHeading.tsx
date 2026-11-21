import { headingFor } from "./metadata";

/**
 * One heading for public routes that mount the website editor.
 * The editor chrome and its sample sections use h2, so this stays the only h1.
 */
export function RouteHeading({ path }: { path: string }) {
  return <h1 className="sr-only">{headingFor(path)}</h1>;
}
