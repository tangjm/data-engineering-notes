---
export_on_save:
  html: true
---
# Marketing funnels

#### Mobile analytics marketing funnel

**Steps**
1. View link
2. Click clink
3. Install app
4. Sign up

#### Flowchart diagram of funnel steps
```mermaid
graph LR
	Enter_Website --> 1.View_Link
	1.View_Link --> 2.Click_Link
	2.Click_Link --> 	id2a(2a.Redirect_to_Adjust)  
	id2a(2a.Redirect_to_Adjust) --> id2b(2b.App_Store)
	id2b(2b.App_Store) --> 3.Install_App
	3.Install_App --> 4.Sign_Up

	style id2a fill:#92e9c1,stroke:#333,stroke-width:2px
	style id2b fill:#92e9c1,stroke:#333,stroke-width:2px
```

Between Steps 2 and 3 the user is redirected to the adjust link which then takes the user to the app/play store.


#### Marketing funnels in terms of venn diagrams

```mermaid
flowchart
  subgraph View Link 
    subgraph Click
			subgraph Install
				v(Sign Up)
    	end
    end
  end
```
		


Click Through Rate (CTR)


```mermaid
flowchart
  subgraph Views 
    Clicks
  end
```

#### Left joins
#### Example funnel - VueJS

#### Activation rates


```mermaid
graph LR
  4.Sign_Up --> 5.Added_book_to_library
  5.Added_book_to_library --> 6.Started_Reading
```

Soft activation rate
```mermaid
flowchart
  subgraph Sign Up 
    v(Added book to library)
  end
```

Activation rate
```mermaid
flowchart 
  subgraph Sign Up 
    v(Started reading a book)
  end

```

Ch.148
Calculate the percentage of users who started reading a book 1 hour after landing on a library page.


