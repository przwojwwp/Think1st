import { TextField } from "../components/TextField";
import { Range } from "../components/Range";
import { useRef, useState } from "react";
import { FileDrop } from "../components/FileDrop";
import { DatePicker } from "../components/DatePicker/DatePicker";
import type { LeavedKey } from "@/types/leavedKey";
import "./formPage.css";

export const FormPage = () => {
  const [age, setAge] = useState<number>(8);
  const [pickedDate, setPickedDate] = useState<string>("");
  const [pickedTime, setPickedTime] = useState<string>("");
  const [hasFile, setHasFile] = useState<boolean>(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [leaveInput, setLeaveInput] = useState<LeavedKey>(null);

  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const ageOk = age >= 8 && age <= 100;

  const canSubmit = Boolean(
    firstName.trim() &&
      lastName.trim() &&
      email &&
      ageOk &&
      hasFile &&
      pickedDate &&
      pickedTime
  );

  const submitDisabled = !canSubmit;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg(null);

    setLeaveInput(["all"]);

    const form = e.currentTarget;

    if (!form.checkValidity()) {
      const firstInvalid = form.querySelector<HTMLElement>(":invalid");
      let target: HTMLElement | null = firstInvalid;

      if (
        firstInvalid instanceof HTMLInputElement &&
        firstInvalid.type === "hidden" &&
        (firstInvalid.name === "date" || firstInvalid.name === "time")
      ) {
        target = form.querySelector<HTMLElement>("#date-section");
      }

      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        if (firstInvalid instanceof HTMLElement && firstInvalid.tabIndex >= 0) {
          firstInvalid.focus({ preventScroll: true });
        }
      }
      return;
    }

    setSending(true);
    try {
      const fd = new FormData(form);
      const res = await fetch("http://letsworkout.pl/submit", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setMsg("Application sent");

      form.reset();
      setPickedDate("");
      setPickedTime("");
      setHasFile(false);
      setFirstName("");
      setLastName("");
      setEmail("");
      setAge(8);
    } catch (err) {
      setMsg(
        err instanceof Error ? `Send failed: ${err.message}` : "Send failed."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="min-h-screen min-w-full flex items-center justify-center">
      <form
        ref={formRef}
        className="flex flex-col w-form m-6 content-box"
        method="post"
        noValidate
        aria-describedby="form-help"
        onSubmit={onSubmit}
      >
        <h1 className="sr-only">Training application</h1>
        <h2>Personal info</h2>

        <fieldset className="flex flex-col w-form">
          <legend className="sr-only">Your personal details</legend>

          <TextField
            label="First name"
            name="firstName"
            type="text"
            minLength={3}
            autoComplete="given-name"
            required
            leave={leaveInput}
            setLeave={setLeaveInput}
            onChangeValue={setFirstName}
          />
          <TextField
            label="Last name"
            name="lastName"
            type="text"
            minLength={3}
            autoComplete="family-name"
            required
            leave={leaveInput}
            setLeave={setLeaveInput}
            onChangeValue={setLastName}
          />
          <TextField
            label="Email address"
            name="email"
            type="email"
            autoComplete="email"
            required
            leave={leaveInput}
            setLeave={setLeaveInput}
            onChangeValue={setEmail}
          />
        </fieldset>

        <Range
          label="Age"
          name="age"
          type="range"
          min={8}
          max={100}
          value={age}
          required
          onChange={setAge}
        />

        <FileDrop
          label="Photo"
          name="attachments"
          accept=".pdf,.doc,.docx,image/*"
          required
          onFileChange={(file) => setHasFile(!!file)}
        />

        <h2>Your workout</h2>
        <DatePicker
          required
          onDateChange={(iso) => setPickedDate(iso)}
          onTimeChange={(t) => setPickedTime(t)}
        />

        <button
          type="submit"
          aria-disabled={submitDisabled}
          className={`w-form h-11.25 mt-6 px-4 py-2 rounded-md text-white transition ${
            submitDisabled
              ? "bg-[#CBB6E5] cursor-default"
              : "bg-border-focus hover:bg-[#6A19CD] cursor-pointer"
          }`}
        >
          {sending ? "Sending…" : "Send Application"}
        </button>

        {msg && <p className="mt-3 text-sm">{msg}</p>}
      </form>
    </section>
  );
};
