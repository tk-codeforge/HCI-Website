import MobileBottomBar from "../components/MobileBottomBar";
import { getHeaderMenu } from "./getHeaderMenu";

// Gives the mobile menu the same CMS menu the header already gets, so the browser no
// longer has to request it (and /look-menu) again on every page.
export default async function MobileBottomBarServer() {
  const initialMenu = await getHeaderMenu();
  return <MobileBottomBar initialMenu={initialMenu} />;
}
