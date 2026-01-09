# samba-edge-functions
A Supabase Edge Functions playground

- first clone the repo locally.
- setup deno(via vscode extension)
    - install the official deno extension from deno.land. It would be automatically suggested by VScode.
    - press F1, the type `Deno: Initialize Workspace Configuration`.
- setup supabase cli
    - Download the CLI application
    - run `supabase start` to pull and run the neccesary containers locally.
- serve your functions locally with `supabase functions server function-name` to test locally. add the `--no-verify-jwt` flag to ignore http authorization header.
- do not forget to run `supabase stop` to stop the local instance.
