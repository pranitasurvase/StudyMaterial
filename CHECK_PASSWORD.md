# PostgreSQL Password Check Kaise Karein

## Option 1: pgAdmin se Check Karein

1. pgAdmin 4 open karein
2. Left sidebar mein "Servers" expand karein
3. "PostgreSQL" par right-click karein
4. "Properties" select karein
5. "Connection" tab mein dekho password kya hai

## Option 2: Common Passwords Try Karein

PostgreSQL ke common default passwords:
- `postgres`
- `admin`
- `root`
- `password`
- `12345`
- Empty password (blank)

## Option 3: Password Reset Karein (Agar Bhool Gaye)

### Windows pe:

1. `pg_hba.conf` file find karein:
   ```
   C:\Program Files\PostgreSQL\<version>\data\pg_hba.conf
   ```

2. File open karein (as Administrator)

3. Is line ko dhundein:
   ```
   host    all             all             127.0.0.1/32            scram-sha-256
   ```

4. `scram-sha-256` ko `trust` se replace karein:
   ```
   host    all             all             127.0.0.1/32            trust
   ```

5. PostgreSQL service restart karein:
   ```
   services.msc > PostgreSQL > Restart
   ```

6. Ab bina password ke connect kar sakte ho

7. Password change karein:
   ```sql
   ALTER USER postgres PASSWORD 'newpassword';
   ```

8. `pg_hba.conf` mein wapas `trust` ko `scram-sha-256` karein

9. Service restart karein

## Mujhe Batao:

Aapka PostgreSQL password kya hai? Phir main `.env` file update kar dunga.

Common options:
1. postgres
2. admin  
3. root
4. (kuch aur)

Batao to main setup complete kar deta hoon! 🚀
