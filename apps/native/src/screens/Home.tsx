import DefaultTemplate from "@templates/Default";
import { Home as HomeShared } from "app/screens/Home";

export default function Home(): JSX.Element {
  return (
    <DefaultTemplate>
      <HomeShared />
    </DefaultTemplate>
  );
}
