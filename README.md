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
```bash
  cd fronted
```
Frontend klasör dizini içine girin ve aşağıdaki komutları çalıştırın:

```bash
npm install
npm start
```

Frontend uygulama `http://localhost:4200` adresinde çalışacaktır.

## Kullanılan Teknolojiler

### Backend Teknolojileri

#### Framework & Runtime
- **Spring Boot 3.5.9** 
- **Java 17** 
- **Maven**
  
#### Güvenlik
- **Spring Security**
- **JWT (JSON Web Token)** 
- **BCrypt** 

#### Veritabanı & ORM
- **Spring Data JPA** 
- **Hibernate** 
- **H2 Database** 


#### Validation & API
- **Spring Boot Validation** 
- **RESTful API** 



### Frontend Teknolojileri

#### Framework & Runtime
- **Angular 17**  
- **TypeScript 5.2**  
- **Node.js / npm**  

#### UI Kütüphaneleri
- **PrimeNG 17** 
- **PrimeIcons 7** 

#### Angular Modülleri
- **Angular Router** 
- **Angular Forms** 
- **Angular HTTP Client** 
- **Angular Animations** 






## Vakit Olsaydı Yapılabilecek Geliştirmeler


### Docker Containerization

- Backend ve frontend için Dockerfile oluşturulması


### Güvenlik İyileştirmeleri

- Rate limiting 
- input validation
- SQL injection koruması
- Secret key güveliği

### Performans

- Caching mekanizması
- Veritabanı sorgu optimizasyonu
- PostgreSQL kullanımı


### Test Yöntemleri
- Test


## Karşılaşılan Zorluklar

Bu projenin geliştirilmesinde karşılaşılan en önemli zorluk, Spring Boot ve Angular framework’lerinin temel kavramlarını öğrenmek ve bu kavramları uygulamaya entegre etmektir.

Backend geliştirme aşamasında; Spring Boot’un temel konuları olan REST Controller yapısı, Spring Data JPA, Spring Security, JWT tabanlı kimlik doğrulama, Entity yapısı, Dependency Injection, Exception Handling, Validation ve Transaction konularının anlaşılması ve projeye entegre edilmesi.

Frontend geliştirme tarafında ise; Angular framework’ünün Component Lifecycle Hooks, Services, Modules, Routing, Reactive Forms, Form Validation, HTTP Client, RxJS Observable ve Template yapısı gibi temel konularının öğrenilmesi ve uygulanması projenin temel zorlukları arasında yer almıştır.

