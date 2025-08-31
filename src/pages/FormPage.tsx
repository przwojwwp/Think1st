import { TextField } from "../components/TextField";
import { Range } from "../components/Range";
import { useState } from "react";
import { FileDrop } from "../components/FileDrop";
import { DatePicker } from "../components/DatePicker/DatePicker";

export const FormPage = () => {
  const [age, setAge] = useState<number>(8);

  return (
    <section className="min-h-screen max-w-full flex items-center justify-center">
      <form
        className="flex flex-col w-form"
        method="post"
        aria-describedby="form-help"
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
          multiple
        />

        <h2>Your workout</h2>
        <DatePicker />
      </form>
    </section>
  );
};
