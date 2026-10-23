# Attribute Management UI

## Project Overview

This project is the UI foundation for an Attribute Management System, developed using Angular and TypeScript


## Project Setup

### Run the Application

```bash
npm start
```

If the start script is unavailable, use:

```bash
npx ng serve
```

Open `http://localhost:4200/` in your browser.

## Standalone Components vs NgModules

Angular supports both standalone components and NgModules to organize application building blocks and their dependencies

### Standalone Components

Standalone components manage their own template dependencies through their `imports` property. They do not need to be declared in an NgModule.
 The component is self-contained and manages its own dependencies directly.

Advantages:
- Less boilerplate and simpler setup.
- Dependencies are easy to identify within each component.
- Components are easier to reuse independently.
- Works well with modern Angular applications and lazy-loaded routes.

### NgModules

NgModules group related components, directives, pipes, and services into a module. Components that are not standalone are generally declared in an NgModule.
 you must create a separate module file to declare the component and import its dependencies.

Advantages:
- Provides a familiar organizational structure for existing Angular applications.
- Can group related features and their dependencies.
- Useful when maintaining legacy applications built around NgModules.

### Why Choose Standalone for This Project?

I chose standalone components because this is a new Angular application and does not need to maintain a legacy NgModule-based structure.


### When Would I Choose NgModules?

I would consider NgModules when working on an existing application that already uses them, when maintaining its established architecture, or when a team has specific module-based conventions.

Both approaches are valid. The choice depends on the application's requirements, existing architecture, and maintenance needs.



## Data Models

The application uses four TypeScript interfaces:

- `IAttribute`: Defines an attribute and its audit information.
- `IBusinessUnit`: Defines a business unit lookup record.
- `ICustomerLocation`: Defines a customer location lookup record.
- `ICompany`: Defines a company lookup record.

These interfaces provide compile-time type checking and a consistent data structure across components and services. They help catch incorrect property names and incompatible value types during development.
