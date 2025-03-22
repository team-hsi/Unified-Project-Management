"use server";

// import { formOpts } from '@/lib/form-options';
// Notice the import path is different from the client
import {
  ServerValidateError,
  // createServerValidate,
} from "@tanstack/react-form/nextjs";

// Create the server action that will infer the types of the form from `formOpts`
// const serverValidate = createServerValidate({
//   ...formOpts,
//   onServerValidate: () => {
//     return 'Server validation: You must be at least 10 to sign up';
//   },
// });

export async function someAction(prev: unknown, formData: FormData) {
  try {
    // await serverValidate(formData);
    // prev;
    // throw new ServerValidateError({
    //   formState: {
    //     values: formData,
    //     errors: ['invalid email or password'] as any,
    //     errorMap: {
    //       onMount: undefined,
    //       onChange: undefined,
    //       onBlur: undefined,
    //       onSubmit: undefined,
    //       onServer: undefined,
    //     },
    //   },
    // });
    // await serverValidate(formData);
    console.log("Your form has successfully validated! 🎉", formData);
    // throw new Error('This should never happen');
  } catch (e) {
    if (e instanceof ServerValidateError) {
      return e.formState;
    }

    // Some other error occurred while validating your form
    throw e;
  }

  // Your form has successfully validated!
}
