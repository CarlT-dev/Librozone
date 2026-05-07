const adminSchema = {
    email: (value) => /\S+@\S+\.\S+/.test(value),
    password: (value) => value.trim().length >= 8,
}

export default adminSchema;