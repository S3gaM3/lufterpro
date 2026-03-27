module.exports = {
  apps: [
    {
      name: 'newlufter-cms-api',
      script: 'dist/src/index.js',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: 4001,
      },
    },
  ],
}
