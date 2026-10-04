import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

/**
 * @kit name: ContactForm
 * @kit group: layout
 * @kit use: A contact or enquiry form with validation, a loading state and a real success state. It sends nothing by itself: pass onSubmit to do something with the values (a server function), and say in the summary what it does.
 * @kit props: onSubmit (async, receives { name, email, message }), submitLabel, successTitle, successMessage
 * @kit example: <ContactForm submitLabel="Send message" onSubmit={async (values) => { await sendMessage({ data: values }); }} />
 */
const schema = z.object({
  name: z.string().min(2, 'Please tell us your name'),
  email: z.string().email('Enter a valid email address'),
  message: z.string().min(10, 'A few more words, please')
});
export type ContactValues = z.infer<typeof schema>;

export function ContactForm({
  onSubmit,
  submitLabel = 'Send message',
  successTitle = 'Thank you',
  successMessage = 'We got your message and will reply soon.'
}: {
  onSubmit?: (values: ContactValues) => Promise<void> | void;
  submitLabel?: string;
  successTitle?: string;
  successMessage?: string;
}) {
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ContactValues>({ resolver: zodResolver(schema) });

  if (done) {
    return (
      <div
        role="status"
        className="border-border bg-card flex flex-col items-center gap-3 rounded-2xl border p-10 text-center"
      >
        <CheckCircle2 className="text-success size-10" aria-hidden="true" />
        <h3 className="font-heading text-xl font-semibold">{successTitle}</h3>
        <p className="text-muted-foreground text-sm">{successMessage}</p>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(async (values) => {
        await onSubmit?.(values);
        setDone(true);
      })}
      className="border-border bg-card space-y-5 rounded-2xl border p-6 sm:p-8"
    >
      <div>
        <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium">
          Name
        </label>
        <Input
          id="contact-name"
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          {...register('name')}
          className="h-11"
        />
        {errors.name ? (
          <p className="text-destructive mt-1.5 text-sm">{errors.name.message}</p>
        ) : null}
      </div>
      <div>
        <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium">
          Email
        </label>
        <Input
          id="contact-email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          {...register('email')}
          className="h-11"
        />
        {errors.email ? (
          <p className="text-destructive mt-1.5 text-sm">{errors.email.message}</p>
        ) : null}
      </div>
      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium">
          Message
        </label>
        <Textarea
          id="contact-message"
          rows={5}
          aria-invalid={Boolean(errors.message)}
          {...register('message')}
        />
        {errors.message ? (
          <p className="text-destructive mt-1.5 text-sm">{errors.message.message}</p>
        ) : null}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring/50 inline-flex h-11 w-full items-center justify-center rounded-lg px-6 text-sm font-medium transition-colors outline-none focus-visible:ring-3 disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? 'Sending…' : submitLabel}
      </button>
    </form>
  );
}
