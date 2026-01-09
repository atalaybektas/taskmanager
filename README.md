# Task Manager

Görev yönetimi için geliştirilmiş full-stack web uygulaması.

## Proje Nasıl Çalıştırılır?

### Gereksinimler

- Java 17 veya üzeri
- Maven 3.6 veya üzeri
- Node.js 18 veya üzeri
- npm

### Backend Kurulumu

Proje kök dizininde (pom.xml dosyasıyla aynı dizinde) aşağıdaki komutları çalıştırın:

```bash
mvn clean install
mvn spring-boot:run
```

Backend uygulama `http://localhost:8081` adresinde çalışacaktır.

### Frontend Kurulumu

Frontend klasör dizini içine girin ve aşağıdaki komutları çalıştırın:

```bash
cd frontend 
npm install
npm start
```

Frontend uygulama `http://localhost:4200` adresinde çalışacaktır.

## Kullanılan Teknolojiler

### Backend Teknolojileri

#### Framework & Runtime
- **Spring Boot 3.5.9** - 
- **Java 17** - 
- **Maven** - 

#### Güvenlik
- **Spring Security** - Kimlik doğrulama ve yetkilendirme framework'ü
- **JWT (JSON Web Token)** - Stateless kimlik doğrulama için token tabanlı güvenlik
- **BCrypt** - Şifre hash'leme algoritması (Spring Security içinde)

#### Veritabanı & ORM
- **Spring Data JPA** - Veritabanı erişim katmanı ve repository pattern implementasyonu
- **Hibernate** - Java Persistence API (JPA) implementasyonu ve ORM framework'ü
- **H2 Database** - In-memory veritabanı (geliştirme ortamı için)


#### Validation & API
- **Spring Boot Validation** - Bean validation ve input doğrulama
- **RESTful API** - HTTP tabanlı REST mimarisi



### Frontend Teknolojileri

#### Framework & Runtime
- **Angular 17** - 
- **TypeScript 5.2** - 
- **Node.js / npm** - 

#### UI Kütüphaneleri
- **PrimeNG 17** - Angular için zengin UI component kütüphanesi
- **PrimeIcons 7** - PrimeNG ile uyumlu ikon kütüphanesi

#### Angular Modülleri
- **Angular Router** - Client-side routing ve navigasyon
- **Angular Forms** - Reactive Forms ve Template-driven Forms
- **Angular HTTP Client** - RESTful API iletişimi
- **Angular Animations** - UI animasyonları






## Vakit Olsaydı Yapılabilecek Geliştirmeler


### Docker Containerization

- Backend ve frontend için Dockerfile oluşturulması
- Docker Compose ile tüm sistemin tek komutla çalıştırılması

### Güvenlik İyileştirmeleri

- Rate limiting mekanizması
- Gelişmiş input validation
- SQL injection koruması

### Performans

- Redis ile caching mekanizması
- Veritabanı sorgu optimizasyonu
- H2 veritabanı yerine PostgreSQL kullanımı

### Test Yöntemleri

- Unit test'ler (JUnit, Mockito)
- Integration test'ler (Spring Boot Test)
- Frontend test'ler (Jasmine, Karma)
- End-to-end test'ler (Protractor/Cypress)


## Karşılaşılan Zorluklar

Bu projenin geliştirilmesinde karşılaşılan en önemli zorluk, Spring Boot ve Angular framework’lerinin temel kavramlarını öğrenmek ve bu kavramları uygulamaya entegre etmektir.

Backend geliştirme aşamasında; Spring Boot’un temel konuları olan REST Controller yapısı, Spring Data JPA, Spring Security, JWT tabanlı kimlik doğrulama, Entity yapısı, Dependency Injection, Exception Handling, Validation ve Transaction Management konularının anlaşılması ve projeye entegre edilmesi önemli bir öğrenme süreci oluşturmuştur.

Frontend geliştirme tarafında ise; Angular framework’ünün Component Lifecycle Hooks, Services, Dependency Injection, Modules, Routing, Reactive Forms, Form Validation, HTTP Client, RxJS Observable ve Template yapısı gibi temel konularının öğrenilmesi ve uygulanması projenin temel zorlukları arasında yer almıştır.

