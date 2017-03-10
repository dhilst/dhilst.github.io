---
layout: post
title:  Gtk Hello World
tags: [gtk, c]
---
Hi to everybody. At this post I will show a hello world program using gtk+-2.0.
You must have gtk+-2.0 headers installed. At Fedora I had to install
gtk2-devel. Our program will have only one button. When the button is pressed
the "Hello world!!!" message is printed to the console.

The first thing to do is include the gtk header as below:

```c
#include <gtk/gtk.h>
```

Next we do define the callback invoked when the button is pressed. The registration
goes next, in the our `main()` :)

```c
static void button_callback(GtkButton *button, gpointer user_data)
{
	g_print(user_data);
}
```

Notice the g_print. Gtk is build on top of glib. glib provide a lot of nice
features but let's focus on Gtk right now. So, for now, g_print is simply 
the glib's printf. Let's define or main:

```
int main(int argc, char **argv)
{
	GtkWidget *window;
	GtkWidget *button;

	gtk_init(&argc, &argv);
```

Every Gtk program starts this way. `gtk_init()` will process each Gtk's
supported argument leaving unknown arguments untouched. You can follow
`gtk_init()` by apropriated `getopt` calls so that you have your own
arguments together with Gtk's arguments. Note that two GtkWidgets
were declared. Both, our root window and the button are widgets. In Gtk
everything that you see in screen is a widget. This design is inherited
from glib too where new types (objects) inherit features from its parents,
like in OOP. Now let's create our widgets and connect some signals.

```c
	window = gtk_window_new(GTK_WINDOW_TOPLEVEL);
	button = gtk_button_new_with_label("Hello world");
	g_signal_connect(button, "clicked", G_CALLBACK(button_callback), "Hello world!!!\n");
	g_signal_connect(window, "destroy", G_CALLBACK(gtk_main_quit), NULL);
	gtk_container_add(GTK_CONTAINER(window), button);
```

First two lines create our window and button widgets. The third line connects
our callback to the `clicked` signal. The fourth parameter is some data passed
to the callback when it is invoked. It goes trought that `gpointer` opaque
type. Each type of widget has it's own signals.  The fourth line connects the
`destroy` signal to `gtk_main_quit`.  `gtk_main_quit` function is used to exit
our application. Finaly the fifth line adds the button to the window.

```c
	gtk_window_set_position(GTK_WINDOW(window), GTK_WIN_POS_CENTER);
	gtk_window_set_title(GTK_WINDOW(window), "Hello gtk world");
```

These two lines setup the position and the title of our window.

```c
	gtk_widget_show_all(window);
	gtk_main();
	return 0;
}
```

And finaly we finish our `main()` function. The first line here make all the
window popup. The second, `gtk_main()` is the Gtk's main loop. This call will
block tills `gtk_main_quit()` is invoked. The main loop is resposible to wait
for user input events and delivery they to the programmer's callbacks. And last
but no least (I really love to say (write) that!) we need to compile all that
lines in something executable. The Gtk library is a wild beast. Happly the
compiler flags are handled by pkg-config tool, so compile this example,
assuming that the file is called `gtk-button-helloworld.c` can be done with
this line:
```
gcc -Wall -o gtk-button-helloworld gtk-button-helloworld.c $(pkg-config --libs --cflags gtk+-2.0) 
```

And here is a screenshot of the program running:
![gtk-button-helloworld]({{ site.url }}/assets/gtk-button-helloworld.png)

The whole code can be found [here](https://gist.github.com/gkos/bea3bbb31d0debb093916066d6a68e73)

That's it!
Cheers!!!
