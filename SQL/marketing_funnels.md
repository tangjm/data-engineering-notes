click -> install -> signp
view link -> click -> install -> signup

search how to draw diagrams using latex

**Mobile analytics marketing funnel**



```mermaid
graph LR
	1.ViewLink --> 2.Click --> 3.Install --> 4.Signup;
```

Between Steps 2 and 3 the user is redirected to the adjust link which then takes the user to the App/Play store.

```mermaid
graph LR
	ViewLink -- CTR --> Click;
	Click -- Click to install rate --> Install;
	Install -- Install to sign up rate --> Signup;
	Click -- Click to sign up rate --> Signup;
```