import { TextField } from "../components/TextField";

export const FormPage = () => {
  return (
    <section className="min-h-screen max-w-full flex items-center justify-center">
      <form className="flex flex-col w-form">
        <h2>Personal info</h2>

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
      </form>
    </section>
  );
};
