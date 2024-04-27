<script>
    let id = 0;
let email = '';
let name = '';
let password = '';

    const handleSubmit = async () => {
      const response = await fetch('https://example.com/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({id, email, name, password}),
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
        id:
        <input bind:value={id} type="int" required />
      </label>
      <label>
        email:
        <input bind:value={email} type="string" required />
      </label>
      <label>
        name:
        <input bind:value={name} type="string" required />
      </label>
      <label>
        password:
        <input bind:value={password} type="string" required />
      </label>
      <button type="submit">Register</button>
    </form>
  </main>