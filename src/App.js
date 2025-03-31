import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import Home from "./Home/Home";
import InviteRedirect from "./Home/InviteRedirect";
import InvitePage from "./Home/InvitePage";
import { InviteKeyProvider } from "./Home/InviteKeyProvider";
export default function App() {
    return (
    <InviteKeyProvider>
      <BrowserRouter>
        <InviteRedirect />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inviteKey/:key" element={<InvitePage />} />
        </Routes>
      </BrowserRouter>
    </InviteKeyProvider>
    );
  }
  