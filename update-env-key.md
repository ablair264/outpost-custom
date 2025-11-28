# Update Your API Key

1. Edit the .env file:
   ```bash
   nano .env
   ```

2. Replace this line:
   ```
   OPENAI_API_KEY=sk-your-new-key-here
   ```

3. With your actual new key:
   ```
   OPENAI_API_KEY=sk-proj-YOUR-ACTUAL-NEW-KEY-HERE
   ```

4. Save the file (Ctrl+O, Enter, Ctrl+X in nano)

5. Restart the backend:
   ```bash
   # Stop the current backend (Ctrl+C)
   npm run backend
   ```

The error will disappear once you use a real API key!