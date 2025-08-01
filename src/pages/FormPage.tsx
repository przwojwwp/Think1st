import { TextField } from "../components/TextField";
import { Range } from "../components/Range";
import { useState } from "react";
import { FileDrop } from "../components/FileDrop";
import { DatePicker } from "../components/DatePicker/DatePicker";

export const FormPage = () => {
  const [age, setAge] = useState<number>(8);
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg(null);
    setSending(true);

    try {
      const fd = new FormData(e.currentTarget);

      // // --- DEBUG: pokaż co dokładnie idzie w body ---
      // // 1) Ładna tabela w konsoli
      // console.group("Submitting FormData");
      // console.table(
      //   Array.from(fd.entries()).map(([key, val]) => ({
      //     key,
      //     value:
      //       val instanceof File
      //         ? `File{name:${val.name}, size:${val.size}, type:${val.type}}`
      //         : String(val),
      //   }))
      // );

      // // 2) Jako obiekt (z łączeniem powtarzających się kluczy w tablice)
      // const debugObject: Record<string, unknown> = {};
      // for (const [key, val] of fd.entries()) {
      //   const v =
      //     val instanceof File
      //       ? { name: val.name, size: val.size, type: val.type }
      //       : val.toString();
      //   if (key in debugObject) {
      //     const cur = debugObject[key];
      //     debugObject[key] = Array.isArray(cur) ? [...cur, v] : [cur, v];
      //   } else {
      //     debugObject[key] = v;
      //   }
      // }
      // console.log("FormData (object-ish):", debugObject);
      // console.groupEnd();
      // // --- KONIEC DEBUGU ---

      const date = fd.get("date")?.toString();
      const time = fd.get("time")?.toString();
      if (!date || !time) {
        throw new Error("Please select a date and time.");
      }

      const res = await fetch("http://letsworkout.pl/submit", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      setMsg("Application sent ✅");
      e.currentTarget.reset();
    } catch (err) {
      setMsg(
        err instanceof Error ? `Send failed: ${err.message}` : "Send failed."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="min-h-screen max-w-full flex items-center justify-center">
      <form
        className="flex flex-col w-form"
        method="post"
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
            autoComplete="given-name"
            required
          />
          <TextField
            label="Last name"
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
          />
          <TextField
            label="Email address"
            name="email"
            type="email"
            autoComplete="email"
            required
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
        />

        <h2>Your workout</h2>
        <DatePicker />

        <button
          type="submit"
          className="w-form h-11.25 mt-12 px-4 py-2 rounded-md bg-purple-600 text-white disabled:opacity-50"
          // disabled={isSubmitDisabled}
        >
          {sending ? "Sending…" : "Send Application"}
        </button>

        {msg && <p className="mt-3 text-sm">{msg}</p>}
      </form>
    </section>
  );
};
