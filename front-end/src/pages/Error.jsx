import { NotFoundError } from "@/components/errors/not-found-error";
import { MaintenanceError } from "@/components/errors/maintenance-error";
import { GeneralError } from "@/components/errors/general-error";
import { UnauthorisedError } from "@/components/errors/unauthorized-error";
import { ForbiddenError } from "@/components/errors/forbidden";

export function ErrorPage({ error }) {
  if (error.status === 404) {
    return <NotFoundError />;
  } else if (error.status === 503) {
    return <MaintenanceError />;
  } else if (error.status === 401) {
    return <UnauthorisedError />;
  } else if (error.status === 403) {
    return <ForbiddenError />;
  } else {
    return <GeneralError />;
  }
}