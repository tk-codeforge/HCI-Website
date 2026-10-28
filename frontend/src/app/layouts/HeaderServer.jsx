import Header from "./Header";
import { getHeaderMenu } from "./getHeaderMenu";

export default async function HeaderServer() {
  const initialMenu = await getHeaderMenu(); // null → Header falls back to DEFAULT_MENU
  return <Header initialMenu={initialMenu} />;
}
