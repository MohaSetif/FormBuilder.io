
    <template>
        <div>
            <form @submit.prevent="handleSubmit">
		<h2>Model: User</h2>
		<label for="id">id:</label>
		<input v-model="id" type="number" name="id" />

		<label for="email">email:</label>
		<input v-model="email" type="text" name="email" />

		<label for="name">name:</label>
		<input v-model="name" type="text" name="name" />

		<label for="password">password:</label>
		<input v-model="password" type="text" name="password" />

                <button type="submit">Register</button>
            </form>
        </div>
    </template>

    <script>
    export default {
        data() {
            return {
                id: '',
                email: '',
                name: '',
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
                    body: JSON.stringify({id: this.id,
						email: this.email,
						name: this.name,
						password: this.password
                    }),
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
    