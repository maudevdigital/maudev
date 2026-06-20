-- Webhook: avisa por correo (Edge Function notify-lead) en cada nuevo lead.
-- Usa pg_net para llamar a la función tras cada INSERT en public.leads.
-- El secreto del header debe coincidir con el secreto WEBHOOK_SECRET configurado
-- en la función (supabase secrets set WEBHOOK_SECRET=...).

create extension if not exists pg_net;

create or replace function public.notify_new_lead()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform net.http_post(
    url     := 'https://hsaoeuuyxrzxlvcvkiab.supabase.co/functions/v1/notify-lead',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-webhook-secret', 'd17e218a271824ae8cc41b362f37dfca6bd80ee49145b4a2'
    ),
    body    := jsonb_build_object('record', to_jsonb(new))
  );
  return new;
end;
$$;

drop trigger if exists trg_notify_new_lead on public.leads;
create trigger trg_notify_new_lead
  after insert on public.leads
  for each row execute function public.notify_new_lead();
