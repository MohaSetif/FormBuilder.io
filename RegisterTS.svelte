<script lang="ts">
    let name = '';
    let email = '';
    let password = '';
  
    const handleSubmit = async () => {
      const response = await fetch('https://example.com/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
  
      if (response.ok) {
        alert('Registration successful!');
      } else {
        alert('Registration failed. Please try again.');
      }
    };
  </script>
  
  <main>
    <h1>Registration Form</h1>
    <form on:submit|preventDefault={handleSubmit}>
      <label>
        Name:
        <input bind:value={name} type="text" required />
      </label>
      <label>
        Email:
        <input bind:value={email} type="email" required />
      </label>
      <label>
        Password:
        <input bind:value={password} type="password" required />
      </label>
      <button type="submit">Register</button>
    </form>
  </main>