import "./styles.css";
import UserComponent from "./user";
import RepositoryComponent from "./repository";

export default function App() {
  return (
    <div className="App">
      <UserComponent username="torvalds" />
      <RepositoryComponent username="torvalds" />
    </div>
  );
}
