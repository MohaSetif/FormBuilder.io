<template>
  <div>
    <h1>Registration Form</h1>
    <form @submit.prevent="handleSubmit">
      <label>
        Name:
        <input v-model="name" type="text" required />
      </label>
      <label>
        Email:
        <input v-model="email" type="email" required />
      </label>
      <label>
        Password:
        <input v-model="password" type="password" required />
      </label>
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
    };
  },
  methods: {
    async handleSubmit() {
      const response = await fetch('https://example.com/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: this.name, email: this.email, password: this.password }),
      });

      if (response.ok) {
        alert('Registration successful!');
      } else {
        alert('Registration failed. Please try again.');
      }
    },
  },
};
</script>